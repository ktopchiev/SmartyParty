import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type Room from '../../models/Room';
import type { Message } from '../../models/Room';
import type Answer from '../../models/Answer';
import type { Player } from '../../models/Player';

export interface RoomState {
    room: Room | null;
    roomsList: Room[];
    currentAnswer: Answer | null;
    status: string;
    gameStatus: string;
    questionIndex: number;
}

const initialState: RoomState = {
    room: null,
    roomsList: [],
    currentAnswer: null,
    status: '',
    gameStatus: '',
    questionIndex: 0,
};

const roomsSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        setRoom: (state, action: PayloadAction<Room>) => {
            state.room = action.payload;
            state.status = 'open';
        },
        addMessageToRoom: (state, action: PayloadAction<Message>) => {
            if (state.room) {
                state.room.messages = [...state.room.messages, action.payload];
            }
        },
        addPlayer: (state, action: PayloadAction<Player>) => {
            if (state.room) {
                state.room.players = [...state.room.players, action.payload];
            }
        },
        updatePlayer: (state, action: PayloadAction<Player>) => {
            if (state.room) {
                let player = state.room.players.find(p => p.username === action.payload.username);
                if (player) player = action.payload;
            }
        },
        removePlayer: (state, action: PayloadAction<Player>) => {
            if (state.room) {
                state.room.players = state.room.players.filter(p => p.username !== action.payload.username);
            }
        },
        setRoomsList: (state, action: PayloadAction<Room[]>) => {
            state.roomsList = action.payload;
        },
        addRoomToList: (state, action: PayloadAction<Room>) => {
            state.roomsList = [...state.roomsList, action.payload];
        },
        resetRoom: (_state) => {
            _state = initialState;
        },
        removeRoom: (state, action: PayloadAction<string>) => {
            if (state.roomsList) {
                state.roomsList = state.roomsList.filter(r => r.id !== action.payload);
                state.status = 'closed';
            }
        },
        setCurrentAnswer: (state, action: PayloadAction<Answer>) => {
            state.currentAnswer = action.payload;
        },
        resetCurrentAnswer: (state) => {
            state.currentAnswer = null;
        },
        setQuestionIndex: (state, action: PayloadAction<number>) => {
            state.questionIndex = action.payload;
        },
    },
});

export const {
    setRoom,
    addMessageToRoom,
    addPlayer,
    updatePlayer,
    removePlayer,
    setRoomsList,
    addRoomToList,
    resetRoom,
    removeRoom,
    setCurrentAnswer,
    resetCurrentAnswer,
    setQuestionIndex,
} = roomsSlice.actions;
export default roomsSlice.reducer;