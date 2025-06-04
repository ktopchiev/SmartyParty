import { isRejectedWithValue } from '@reduxjs/toolkit'
import type { MiddlewareAPI, Middleware } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

interface ApiError {
    status: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any
}

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger: Middleware =
    (_api: MiddlewareAPI) => (next) => (action) => {
        // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
        if (isRejectedWithValue(action)) {
            const errorPayload = action.payload as ApiError

            switch (errorPayload.status) {
                case 404:
                    toast.warning(errorPayload.data.message || 'Not Found');
                    break;
                case 401:
                    toast.error(errorPayload.data.message || 'Unathorized');
                    break;
                case 400:
                    toast.error(errorPayload.data.message || 'Bad Request');
                    break;
                case 500:
                    toast.error(errorPayload.data.message || 'Internal Server Error');
                    break;
                default:
                    break;
            }
        }

        return next(action)
    }