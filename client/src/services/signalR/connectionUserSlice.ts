import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface RoomState {
    id: string | null;
    name: string | null;
    creator: string | null;
    topic: string | null;
    status: string | null;
    players: string[];
}

function initRoomState(): RoomState {
    return {
        id: null,
        name: null,
        creator: null,
        topic: null,
        status: null,
        players: [],
    }
}

export const connectionUserSlice = createSlice({
    name: "room",
    initialState: {
        roomState: initRoomState()
    },
    reducers: {
        setRoom: (state, action: PayloadAction<RoomState>) => {
            state.roomState = action.payload;
        }
    },
});

export const { setRoom } = connectionUserSlice.actions