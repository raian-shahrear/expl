import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { EventServices } from './events.service';

// create an event
const createEvent = catchAsync(async (req, res) => {
  const result = await EventServices.createEventIntoDB(req.body);

  // send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Event is created successfully!',
    data: result,
  });
});

// create event's host
const createEventHost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await EventServices.createEventHostIntoDB(id, req.body);

  // send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Event is updated successfully!',
    data: result,
  });
});

// create event guest
const createEventGuest = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await EventServices.createEventGuestIntoDB(id, req.body);

  // send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Event is updated successfully!',
    data: result,
  });
});

// get all events
const getAllEvents = catchAsync(async (req, res) => {
  const result = await EventServices.getAllEventsFromDB(req.query);

  // send response
  res
    .status(result?.result?.length ? httpStatus.OK : httpStatus.NOT_FOUND)
    .json({
      success: result?.result?.length ? true : false,
      statusCode: result?.result?.length ? httpStatus.OK : httpStatus.NOT_FOUND,
      message: result?.result?.length
        ? 'Events are retrieved successfully!'
        : 'No Data Found!',
      data: result?.result,
      meta: result?.meta,
    });
});

// get single event
const getSingleEvent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await EventServices.getSingleEventFromDB(id);

  // send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Event is retrieved successfully!',
    data: result,
  });
});

// update event
const updateEvent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await EventServices.updateEventIntoDB(id, req.body);

  // send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Event is updated successfully!',
    data: result,
  });
});

// delete event
const deleteEvent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await EventServices.deleteEventFromDB(id);

  // send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Event is deleted successfully!',
    data: result,
  });
});

// delete event's host
const deleteEventHost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await EventServices.deleteEventHostFromDB(id, req.body);

  // send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Event's host is deleted successfully!",
    data: result,
  });
});

// delete event's guest
const deleteEventGuest = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await EventServices.deleteEventGuestFromDB(id, req.body);

  // send response
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Event's guest is deleted successfully!",
    data: result,
  });
});

export const EventControllers = {
  createEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
  createEventHost,
  createEventGuest,
  deleteEventHost,
  deleteEventGuest,
};
