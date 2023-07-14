export const realDate=(timestamp)=>{
    const date = new Date(timestamp * 1000); // Multiply by 1000 to convert from seconds to milliseconds
    
    // Extract individual components of the date
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-based, so add 1
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    // Create the formatted date string
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const formattedDateTime = `${formattedDate} ${formattedTime}`;
    
    console.log(formattedDateTime);
    return formattedDateTime;
}