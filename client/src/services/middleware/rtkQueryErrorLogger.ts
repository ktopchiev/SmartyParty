import { isRejectedWithValue } from '@reduxjs/toolkit'
import type { MiddlewareAPI, Middleware } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { navigate } from '../../navigate/navigate'

interface ApiError {
    status: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    detail?: string,
    title: string
}

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger: Middleware =
    (api: MiddlewareAPI) => (next) => (action) => {
        // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
        // const navigate = useNavigate();
        if (isRejectedWithValue(action)) {
            const errorPayload = action.payload as ApiError
            switch (errorPayload.status) {
                case 404:
                    toast.warning(errorPayload.detail || 'Not Found');
                    break;
                case 401:
                    toast.warn(errorPayload.title + ". " + 'Unathorized');
                    break;
                case 400:
                    toast.error(errorPayload.detail || 'Bad Request');
                    break;
                case 500:
                    toast.error(errorPayload.detail || 'Internal Server Error');
                    navigate('/server-error', { state: { error: errorPayload } });
                    break;
                default:
                    break;
            }
        }

        return next(action)
    }