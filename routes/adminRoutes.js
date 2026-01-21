const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organizationController');
const machineController = require('../controllers/machineController');
const guardController = require('../controllers/guardController');
const attendancePointController = require('../controllers/attendancePointController');
const patrolPointController = require('../controllers/patrolPointController');
const assignmentController = require('../controllers/assignmentController');
const logController = require('../controllers/logController');

// Home/Dashboard
router.get('/', (req, res) => {
    res.render('dashboard');
});

// Organizations
router.get('/organizations', organizationController.list);
router.get('/organizations/new', organizationController.new);
router.post('/organizations', organizationController.create);
router.get('/organizations/:id/edit', organizationController.edit);
router.post('/organizations/:id', organizationController.update);
router.post('/organizations/:id/delete', organizationController.delete);

// Machines
router.get('/machines', machineController.list);
router.get('/machines/new', machineController.new);
router.post('/machines', machineController.create);
router.get('/machines/:id/edit', machineController.edit);
router.post('/machines/:id', machineController.update);
router.post('/machines/:id/delete', machineController.delete);

// Guards
router.get('/guards', guardController.list);
router.get('/guards/new', guardController.new);
router.post('/guards', guardController.create);
router.get('/guards/:id/edit', guardController.edit);
router.post('/guards/:id', guardController.update);
router.post('/guards/:id/delete', guardController.delete);

// Attendance Points
router.get('/attendance-points', attendancePointController.list);
router.get('/attendance-points/new', attendancePointController.new);
router.post('/attendance-points', attendancePointController.create);
router.get('/attendance-points/:id/edit', attendancePointController.edit);
router.post('/attendance-points/:id', attendancePointController.update);
router.post('/attendance-points/:id/delete', attendancePointController.delete);

// Patrol Points
router.get('/patrol-points', patrolPointController.list);
router.get('/patrol-points/new', patrolPointController.new);
router.post('/patrol-points', patrolPointController.create);
router.get('/patrol-points/:id/edit', patrolPointController.edit);
router.post('/patrol-points/:id', patrolPointController.update);
router.post('/patrol-points/:id/delete', patrolPointController.delete);

// Attendance Assignments
router.get('/attendance-assignments', assignmentController.listAttendance);
router.get('/attendance-assignments/new', assignmentController.newAttendance);
router.post('/attendance-assignments', assignmentController.createAttendance);
router.get('/attendance-assignments/:id/edit', assignmentController.editAttendance);
router.post('/attendance-assignments/:id', assignmentController.updateAttendance);
router.post('/attendance-assignments/:id/delete', assignmentController.deleteAttendance);

// Patrol Assignments
router.get('/patrol-assignments', assignmentController.listPatrol);
router.get('/patrol-assignments/new', assignmentController.newPatrol);
router.post('/patrol-assignments', assignmentController.createPatrol);
router.get('/patrol-assignments/:id/edit', assignmentController.editPatrol);
router.post('/patrol-assignments/:id', assignmentController.updatePatrol);
router.post('/patrol-assignments/:id/delete', assignmentController.deletePatrol);

// Logs
router.get('/logs/attendance', logController.listAttendance);
router.get('/logs/patrol', logController.listPatrol);

module.exports = router;
