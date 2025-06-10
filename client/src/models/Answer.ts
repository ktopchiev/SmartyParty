import type { Option } from "./Room";

export default interface Answer {
    id: number;
    roomId: string;
    from: string;
    option: Option;
}