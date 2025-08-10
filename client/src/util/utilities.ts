
export function getJwtTokenFromLocalStorage() {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData).token : "";
}

export function getUsernameFromJwtToken() {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData).username : "";
}