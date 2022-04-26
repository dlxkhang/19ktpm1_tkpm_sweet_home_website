const scheduleModel = require('../models/Schedule');
const userModel = require('../models/User');
const moment = require('moment');

module.exports.loadHomeTours = (userId) => {
    return new Promise(async (resolve, reject) => {
        userModel
            .findById(userId, 'schedule')
            .populate({
                path: 'schedule',
                select: 'propertyId appointmentDate',
                populate: {
                    path: 'propertyId',
                    select: 'name address description price previewImage'
                },
                options: { sort: { appointmentDate: -1 }}
            })
            .exec((err, user) => {
                const homeTours = user.schedule.map((homeTour) => {
                    return {
                        id: homeTour._id,
                        status: homeTour.ack,
                        appointmentDate: moment(homeTour.appointmentDate),
                        propertyName: homeTour.propertyId.name,
                        propertyAddress: homeTour.propertyId.address,
                        propertyDescription: homeTour.propertyId.description,
                        propertyPrice: homeTour.propertyId.price,
                        propertyImage: homeTour.propertyId.previewImage
                    }
                })
                resolve(homeTours);
            });
    });
}

module.exports.requestTour = (userId, requestTour) => {
    return new Promise((resolve, reject) => {
        if(requestTour) {
            const newSchedule = {
              fullName: requestTour.fullName,
              email: requestTour.email,
              propertyId: requestTour.propertyId,
              ack: requestTour.ack,
              appointmentDate: requestTour.appointmentDate
            };

            if(requestTour.message)
                newSchedule['message'] = requestTour.message;

            if(requestTour.phoneNumber)
                newSchedule['phoneNumber'] = requestTour.phoneNumber;

            const newScheduleModel = new scheduleModel(newSchedule);

            newScheduleModel.save(async (err, savedDoc) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                await userModel.findOneAndUpdate(
                    { _id: userId }, 
                    { $push: { schedule: savedDoc._id} }, 
                    {upsert: true}
                );
                resolve(moment(savedDoc.appointmentDate));
                // saved!
            });
        } 
    });
}

module.exports.cancelHomeTour = (userId, homeTourId) => {
    return new Promise((resolve, reject) => {
        if(homeTourId) {
            userModel.findOneAndUpdate(
                { _id: userId }, 
                { $pull: { schedule: homeTourId} },
                (err) => {
                    if(err) {
                        console.log(err);
                        reject(err);
                        return;
                    }
                    scheduleModel.deleteOne({ _id: homeTourId }, (err) => {
                        if(err) {
                            console.log(err);
                            reject(err);
                            return;
                        }
                        resolve('success');
                    });
                }
            );
        } 
    });
}