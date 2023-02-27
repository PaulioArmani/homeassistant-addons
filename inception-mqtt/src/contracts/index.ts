export interface ControlObjectInterface {
  ReportingID: number;
  ID: string;
  Name: string;
}

export type StateRequestType = "AreaStateRequest" | "DoorStateRequest" | "InputStateRequest" | "OutputStateRequest";

export interface MonitorStateUpdatesPayloadInterface {
  ID: StateRequestType;
  RequestType: string;
  InputData: MonitorStateInputData
}

export interface MonitorStateUpdatesResponseInterface {
  ID: StateRequestType;
  Result: StateResultInterface
}

export interface StateResultInterface {
  updateTime: number;
  stateData: StateDataInterface[];
}

export interface StateDataInterface {
  ID: string;
  PublicState: number;
}

export interface MonitorReviewUpdatesResponseInterface {
  ID: string
  Result: ReviewDataInterface[]
}

export interface ReviewDataInterface {
  ID: string;
  Description: string;
  MessageCategory: number;
  What: string;
  Where: string;
  WhenTicks: number;
}

export interface MonitorStateInputData {
  stateType: string;
  timeSinceUpdate: string;
}

export type LiveReviewRequestType = "LiveReviewEvents";


export interface MonitorReviewUpdatesPayloadInterface {
  ID: LiveReviewRequestType;
  RequestType: LiveReviewRequestType;
  InputData: MonitorReviewInputData
}

export interface MonitorReviewInputData {
  referenceId: string;
  referenceTime: number;
}

export interface MqttConfig {
  broker: string,
  port: number,
  username: string,
  password: string,
  qos: 0 | 1 | 2,
  retain: boolean,
  discovery: boolean,
  discovery_prefix: string,
  topic_prefix: string,
  availability_topic: string,
  alarm_code: number,
}

export interface InceptionConfig {
  base_url: string,
  port: number,
  username: string,
  password: string,
  polling_timeout: number,
  polling_delay: number,
}

export interface Config {
  mqtt: MqttConfig,
  inception: InceptionConfig
}
