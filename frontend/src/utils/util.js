/* Part of this file was leveraged from GPT */ 
export const convertDate2Readable = (dateString) => {
    const options = {
        timeZone: "America/Los_Angeles",
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };
    const date = new Date(dateString); // Convert string to Date object
    const datePacific = date.toLocaleString('en-US', options);
    return datePacific;
}