const express = require('express');
const router = express.Router();
const db = require('../database');

router.delete('/:id', (req, res) => {
  if (isNaN(reg_id)) return res.status(400).json({ error: 'Invalid registration ID' });

  const reg_id = parseInt(req.params.id);

  const cancel = db.transaction(() => {
    const reg = db.prepare(
      "SELECT * FROM registrations WHERE id = ? AND status = 'active'"
    ).get(reg_id);

    if (!reg) return { status: 404, error: 'Active registration not found' };

    db.prepare("UPDATE registrations SET status = 'cancelled' WHERE id = ?").run(reg_id);
    db.prepare('UPDATE events SET available_seats = available_seats + 1 WHERE id = ?').run(reg.event_id);

    return { status: 200, message: 'Registration cancelled' };
  });

  const result = cancel();
  return res.status(result.status).json(result);
});

module.exports = router;