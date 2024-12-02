/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { TEvent } from './events.interface';
import { EventModel } from './events.model';

// create an event
const createEventIntoDB = async (payload: Partial<TEvent>) => {
  const result = await EventModel.create(payload);
  return result;
};

// create event's host
const createEventHostIntoDB = async (id: string, payload: Partial<TEvent>) => {
  const isEventExist = await EventModel.findById(id);
  if (!isEventExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This event is not found!');
  }

  const result = await EventModel.findByIdAndUpdate(
    id,
    { $push: { hostedBy: payload } },
    { new: true },
  );
  return result;
};

// create event's guest
const createEventGuestIntoDB = async (id: string, payload: Partial<TEvent>) => {
  const isEventExist = await EventModel.findById(id);
  if (!isEventExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This event is not found!');
  }

  const result = await EventModel.findByIdAndUpdate(
    id,
    { $push: { guests: payload } },
    { new: true },
  );
  return result;
};

// get all events
const getAllEventsFromDB = async (query: Record<string, unknown>) => {
  const getQuery = new QueryBuilder(EventModel.find(), query)
    .sort()
    .search(['title', 'eventDetails', 'eventPlace'])
    .filter()
    .paginate();
  const result = await getQuery.queryModel;
  const meta = await getQuery.countTotal();

  return {
    meta,
    result,
  };
};

// get single event
const getSingleEventFromDB = async (id: string) => {
  const result = await EventModel.findById(id);
  return result;
};

// update event
const updateEventIntoDB = async (id: string, payload: Partial<TEvent>) => {
  const isEventExist = await EventModel.findById(id);
  if (!isEventExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This event is not found!');
  }

  const result = await EventModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

// delete event
const deleteEventFromDB = async (id: string) => {
  const isEventExist = await EventModel.findById(id);
  if (!isEventExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This event is not found!');
  }

  const result = await EventModel.findByIdAndDelete(id);
  return result;
};

// delete event's host
const deleteEventHostFromDB = async (id: string, payload: any) => {
  const result = await EventModel.findByIdAndUpdate(
    id,
    { $pull: { hostedBy: { _id: payload?.hostId } } },
    { new: true },
  );
  return result;
};

// delete event's guest
const deleteEventGuestFromDB = async (id: string, payload: any) => {
  const result = await EventModel.findByIdAndUpdate(
    id,
    { $pull: { guests: { _id: payload?.guestId } } },
    { new: true },
  );
  return result;
};

export const EventServices = {
  createEventIntoDB,
  getAllEventsFromDB,
  getSingleEventFromDB,
  updateEventIntoDB,
  deleteEventFromDB,
  createEventHostIntoDB,
  createEventGuestIntoDB,
  deleteEventHostFromDB,
  deleteEventGuestFromDB,
};
