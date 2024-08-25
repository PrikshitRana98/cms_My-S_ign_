export const ASYNC_STORAGE = {
  USER_DETAILS: 'userDetails',
  LOGGED: 'logged',
};

export const convertSecondsToMinutes=(seconds)=> {
  if(seconds&&Number.isInteger(seconds)){
    const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes} min ${remainingSeconds} sec`;
  }else{
    return null
  }
}
