const express = require('express');
const router = express.Router();
const db = require('../database');

router.post('/', (req, res) => {
  const { name, total_seats, event_date } = req.body;

  if (!name || !name.trim())
    return res.status(400).json({ error: 'Event name is required' });

  if (!Number.isInteger(total_seats) || total_seats <= 0)
    return res.status(400).json({ error: 'Total seats must be a positive integer' });

  const eventDt = new Date(event_date);
  if (isNaN(eventDt) || eventDt <= new Date())
    return res.status(400).json({ error: 'Event date must be a valid future date' });

  try {
    db.prepare(
      'INSERT INTO events (name, total_seats, available_seats, event_date) VALUES (?, ?, ?, ?)'
    ).run(name.trim(), total_seats, total_seats, event_date);

    return res.status(201).json({ message: 'Event created successfully' });
  } catch (err) {
    return res.status(409).json({ error: 'Event name already exists' });
  }
});

router.get('/', (req, res) => {
  const { upcoming, sort } = req.query;

  let query = `
    SELECT e.id, e.name, e.total_seats, e.available_seats, e.event_date,
           COUNT(CASE WHEN r.status = 'active' THEN 1 END) as total_registrations
    FROM events e
    LEFT JOIN registrations r ON e.id = r.event_id
  `;

  const params = [];
if (upcoming === 'true') {
    query += ' WHERE e.event_date > ?';
    params.push(new Date().toISOString());
}
query += ' GROUP BY e.id';
if (sort === 'true') query += ' ORDER BY e.event_date ASC';
const rows = db.prepare(query).all(...params);
  return res.json(rows);
});

router.post('/:id/register', (req, res) => {
  const event_id = parseInt(req.params.id);
  const { user_name } = req.body;

  if (!user_name || !user_name.trim())
    return res.status(400).json({ error: 'user_name is required' });

  const register = db.transaction(() => {
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(event_id);
    if (!event) return { status: 404, error: 'Event not found' };

    if (event.available_seats <= 0) return { status: 409, error: 'Event is full' };

    const existing = db.prepare(
      "SELECT * FROM registrations WHERE user_name = ? AND event_id = ? AND status = 'active'"
    ).get(user_name.trim(), event_id);

    if (existing) return { status: 409, error: 'User already registered for this event' };

    db.prepare(
      'INSERT INTO registrations (user_name, event_id, registered_at) VALUES (?, ?, ?)'
    ).run(user_name.trim(), event_id, new Date().toISOString());

    db.prepare(
      'UPDATE events SET available_seats = available_seats - 1 WHERE id = ?'
    ).run(event_id);

    return { status: 201, message: 'Registration successful' };
  });

  const result = register();
  return res.status(result.status).json(result);
});
router.get('/:id/registrations', (req, res) => {
    if (!parseInt(req.params.id)) return res.status(400).json({ error: 'Invalid event ID' });

  const rows = db.prepare(
    "SELECT id, user_name, registered_at FROM registrations WHERE event_id = ? AND status = 'active'"
  ).all(req.params.id);
  return res.json(rows);
});

module.exports = router;