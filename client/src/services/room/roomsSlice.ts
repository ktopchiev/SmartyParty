import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type Room from '../../models/Room';
import type { Message } from '../../models/Room';
import type Answer from '../../models/Answer';
import type { Player } from '../../models/Player';
import type { GameStatus } from '../../models/GameStatus';


export interface RoomState {
    room: Room | null;
    roomsList: Room[];
    roomsListLoaded: boolean;
    status: 'idle' | 'loading' | 'ready' | 'error';
}

const initialState: RoomState = {
    room: null,
    roomsList: [],
    roomsListLoaded: false,
    status: 'idle',
};

const roomsSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        setRoom: (state, action: PayloadAction<Room>) => {
            state.room = action.payload;
            state.status = 'ready';
            state.room.availability = 'open';
        },
        setStatus: (state, action: PayloadAction<'idle' | 'loading' | 'ready' | 'error'>) => {
            state.status = action.payload;
        },
        addMessageToRoom: (state, action: PayloadAction<Message>) => {
            if (state.room) {
                state.room.messages = [...state.room.messages, action.payload];
                state.room.unreadMessages += 1;
            }
        },
        setUnreadMessagesCount: (state, action: PayloadAction<number>) => {
            if (state.room) {
                state.room.unreadMessages = action.payload;
            }
        },
        addPlayer: (state, action: PayloadAction<Player>) => {
            if (state.room && !state.room.players.find(p => p.username === action.payload.username)) {
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
            state.roomsListLoaded = true;
        },
        addRoomToList: (state, action: PayloadAction<Room>) => {
            state.roomsList = [...state.roomsList, action.payload];
            state.roomsListLoaded = true;
        },
        resetState: (_state) => {
            _state = initialState;
        },
        resetRoom: (state) => {
            state.room = null;
        },
        removeRoom: (state, action: PayloadAction<string>) => {
            if (state.roomsList) {
                state.roomsList = state.roomsList.filter(r => r.id !== action.payload);
                state.roomsListLoaded = true;
                state.room = null;
            }
        },
        setCurrentAnswer: (state, action: PayloadAction<Answer>) => {
            if (state.room) {
                state.room.currentAnswer = action.payload;
            }
        },
        resetCurrentAnswer: (state) => {
            if (state.room) {
                state.room.currentAnswer = null;
            }
        },
        setQuestionIndex: (state, action: PayloadAction<number>) => {
            if (state.room) {
                state.room.questionIndex = action.payload;
            }
        },
        setGameStatus: (state, action: PayloadAction<GameStatus["status"]>) => {
            if (state.room) {
                state.room.gameStatus = action.payload;
            };
        }
    },
});

export const {
    setRoom,
    setStatus,
    addMessageToRoom,
    setUnreadMessagesCount,
    addPlayer,
    updatePlayer,
    removePlayer,
    setRoomsList,
    addRoomToList,
    resetState,
    resetRoom,
    removeRoom,
    setCurrentAnswer,
    resetCurrentAnswer,
    setQuestionIndex,
    setGameStatus,
} = roomsSlice.actions;

export default roomsSlice.reducer;