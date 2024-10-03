// Write your "actions" router here!
const express = require('express');
const Actions = require('./actions-model'); // Assuming this imports the actions model
const router = express.Router();

// [GET] /api/actions
router.get('/', async (req, res) => {
  try {
    const actions = await Actions.get();
    res.json(actions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get actions' });
  }
});

// [GET] /api/actions/:id
router.get('/:id', async (req, res) => {
  try {
    const action = await Actions.get(req.params.id);
    if (action) {
      res.json(action);
    } else {
      res.status(404).json({ message: 'Action not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to get action' });
  }
});

// [POST] /api/actions
router.post('/', async (req, res) => {
  const { project_id, description, notes } = req.body;
  // Check for required fields
  if (!project_id || !description || !notes) {
    return res.status(400).json({ message: 'Project ID, description, and notes are required' });
  }

  try {
    const newAction = await Actions.insert(req.body);
    res.status(201).json(newAction);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create new action' });
  }
});

// [PUT] /api/actions/:id
router.put('/:id', async (req, res) => {
  const changes = req.body;
  // Check for required fields
  if (!changes.project_id || !changes.description || changes.notes === undefined) {
    return res.status(400).json({ message: 'Project ID, description, and notes are required' });
  }

  try {
    const updatedAction = await Actions.update(req.params.id, changes);
    if (updatedAction) {
      res.json(updatedAction);
    } else {
      res.status(404).json({ message: 'Action not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to update action' });
  }
});

// [DELETE] /api/actions/:id
router.delete('/:id', async (req, res) => {
  try {
    const deletedCount = await Actions.remove(req.params.id);
    if (deletedCount) {
      res.status(204).end(); // No content response
    } else {
      res.status(404).json({ message: 'Action not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete action' });
  }
});

module.exports = router;