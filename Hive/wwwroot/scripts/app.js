var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { renderGame } from "@myob-fma/hex-renderer";
const moveRequest = (move) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield fetch('https://localhost:5001/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: "no-cors",
        body: JSON.stringify(move)
    });
    return yield response.json();
});
const newRequest = () => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield fetch('https://localhost:5001/new', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        mode: "cors",
        body: JSON.stringify(""),
    });
    return yield response.json();
});
const biancasEngine = () => {
    return {
        initialState() {
            return __awaiter(this, void 0, void 0, function* () {
                let r = yield newRequest();
                console.log(r);
                return r;
            });
        },
        playMove(move) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield moveRequest(move);
            });
        }
    };
};
renderGame({
    engine: biancasEngine(),
    container: document.getElementById('board'),
});
//# sourceMappingURL=app.js.map