
export function getJwtTokenFromLocalStorage() {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData).token : "";
}


export function getUserFromJwtToken() {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData).username : "";
}