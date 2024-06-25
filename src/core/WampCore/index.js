import { reactive } from "vue";
import { makeid } from "../../helpers";
export class WampProtocolModel {
  WAMP_CODES = {
    WELCOME: 0,
    CALL: 2,
    CALL_RESULT: 3,
    CALL_ERROR: 4,
    SUBSCRIBE: 5,
    UNSUBSCRIBE: 6,
    EVENT: 8,
    HEARTBEAT: 20,
  };
  constructor() {
    this.constants = {
      recconectAttempts: 3,
      recconectTimeoutMs: 5000,
      pingInterval: 29000,
    };
    this.state = {
      counterPing: 0,
      isConnect: false,
    };
    this.events = {
      connect: () => {},
      auth: () => {},
      message: () => {},
      error: () => {},
      errorSubscribe: () => {},
      errorSocket: () => {},
      event: () => {},
    };
    this.codesWithEvents = {
      [this.WAMP_CODES.WELCOME]: "connect",
      [this.WAMP_CODES.UNSUBSCRIBE]: "errorSubscribe",
      [this.WAMP_CODES.CALL_ERROR]: "error",
      [this.WAMP_CODES.SUBSCRIBE]: "subscribe",
      [this.WAMP_CODES.EVENT]: "event",
      default: "message",
    };
    this.apiURLS = {
      connect: "test.enter-systems.ru/task/js",
      login: "http://enter.local/login",
      logs: "http://enter.local/subscription/logs/list",
    };
    this.socket = null;
  }
  pingProtocol() {
    setInterval(() => {
      this.socket.send(
        this._preparePayload([
          this.WAMP_CODES.HEARTBEAT,
          this.state.counterPing,
        ])
      );
      this.state.counterPing++;
    }, this.constants.pingInterval);
  }
  connect() {
    this.socket = new WebSocket(`ws://${this.apiURLS.connect}`);
    this.subscribeOnEvents();
    this.pingProtocol();
  }
  signIn({ login, password }) {
    if (!this.state.isConnect) return;
    this.socket.send(
      this._preparePayload([
        this.WAMP_CODES.CALL,
        makeid(16),
        this.apiURLS.login,
        login,
        password,
      ])
    );
  }
  subscribeOnEvents() {
    if (!this.socket) return;
    this.socket.addEventListener("message", (res) => {
      const parseResponse = this._parseWampResponse(res);
      const keyCode = parseResponse.code;
      const eventEmitCode = this.codesWithEvents[keyCode]
        ? this.codesWithEvents[keyCode]
        : this.codesWithEvents["default"];

      if (keyCode === this.WAMP_CODES.WELCOME) this.state.isConnect = true;
      else if (
        keyCode === this.WAMP_CODES.CALL_RESULT &&
        parseResponse?.bodyData?.Username
      )
        return this.events["auth"](parseResponse);
      this.events[eventEmitCode](parseResponse);
    });

    this.socket.addEventListener("close", this._clearState);
    this.socket.addEventListener("error", () => this.events["errorSocket"]());
  }
  subscribeLogs() {
    if (!this.state.isConnect) return;
    this.socket.send(
      this._preparePayload([this.WAMP_CODES.SUBSCRIBE, this.apiURLS.logs])
    );
  }
  on(event, cb) {
    this.events[event] = cb;
  }
  _preparePayload(payload) {
    return JSON.stringify(payload);
  }
  _parseWampResponse(socketData) {
    const prepare = JSON.parse(socketData.data);
    const getBodyData = () => {
      let res = {};
      prepare.forEach((element) => {
        if (typeof element === "object") res = element;
      });
      return res;
    };
    return {
      raw: socketData.data,
      bodyData: getBodyData(),
      prepare,
      code: prepare[0],
    };
  }
  _clearState() {
    this.state = {
      isConnect: false,
      isAuth: false,
      userInfo: null,
      isLogsLoading: false,
      logs: [],
    };
  }
}

export class AppClass {
  constructor() {
    this.state = reactive({
      isAuth: false,
      userInfo: null,
      isLogsLoading: false,
      logs: [],
    });
    this.wp = new WampProtocolModel();
    this.wp.on("connect", () => {
      this.wp.signIn({ login: "enter", password: "A505a" });
    });
    this.wp.on("auth", ({ bodyData }) => {
      this.state.userInfo = bodyData;
      this.isAuth = true;
      this.wp.subscribeLogs();
    });
    this.wp.on("event", ({ bodyData }) => {
      this.state.logs = bodyData.Items;
    });
    this.wp.on("message", this.handleMessage);
    this.wp.connect();
  }
  handleMessage(res) {
    // console.log(123123123, res);
  }
}
