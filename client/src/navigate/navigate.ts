let navigateFunction: (path: string, data: any) => void;

export const setNavigate = (navFn: typeof navigateFunction) => {
    navigateFunction = navFn;
};

export const navigate = (path: string, data: any) => {
    if (navigateFunction) {
        navigateFunction(path, data);
    } else {
        console.warn("Navigate function not initialized.");
    }
};