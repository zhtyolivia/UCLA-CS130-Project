const emailExistsInBoth = async (Driver, Passenger, email) => {
    const passengerExists = await Passenger.findOne({ email }).exec();
    const driverExists = await Driver.findOne({ email }).exec();
    return passengerExists || driverExists ? true : false;
};

module.exports = {
    emailExistsInBoth
};
