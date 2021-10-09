import { ListViewModel } from "./listview.model";
//TEMP DATA FOR TESTING VISUALS ONLY. REMOVE LATER.
const usEast1: ListViewModel = {
  azTitle: "US-East-1a",
  azReceiver: "US-West-1a",
  latency: 1.221,
  date: "10/6/21"
}
const usEast2: ListViewModel = {
  azTitle: "US-East-1a",
  azReceiver: "US-West-1b",
  latency: 1.201,
  date: "10/6/21"
}
const usEast3: ListViewModel = {
  azTitle: "US-East-1a",
  azReceiver: "US-West-1c",
  latency: 1.199,
  date: "10/6/21"
}
const usEast4: ListViewModel = {
  azTitle: "US-East-1a",
  azReceiver: "US-West-1d",
  latency: 1.281,
  date: "10/6/21"
}
const usEast5: ListViewModel = {
  azTitle: "US-East-1a",
  azReceiver: "US-West-1e",
  latency: 1.242,
  date: "10/6/21"
}
const usEast6: ListViewModel = {
  azTitle: "US-East-1a",
  azReceiver: "US-West-1f",
  latency: 1.121,
  date: "10/6/21"
}
const usWest1: ListViewModel = {
  azTitle: "US-East-1a",
  azReceiver: "US-West-1a",
  latency: 1.221,
  date: "10/6/21"
}
//WEST AS SENDER BELOW
const usWest2: ListViewModel = {
  azTitle: "US-West-1a",
  azReceiver: "US-East-1a",
  latency: 1.991,
  date: "10/6/21"
}
const usWest3: ListViewModel = {
  azTitle: "US-West-1a",
  azReceiver: "US-East-1b",
  latency: 1.284,
  date: "10/6/21"
}
const usWest4: ListViewModel = {
  azTitle: "US-West-1a",
  azReceiver: "US-East-1c",
  latency: 1.24,
  date: "10/6/21"
}
const usWest5: ListViewModel = {
  azTitle: "US-West-1a",
  azReceiver: "US-East-1d",
  latency: 1.301,
  date: "10/6/21"
}
const usWest6: ListViewModel = {
  azTitle: "US-West-1a",
  azReceiver: "US-East-1e",
  latency: 1.291,
  date: "10/6/21"
}

export const MOCK_DATA = [
  usEast1,
  usEast2,
  usEast3,
  usEast4,
  usEast5,
  usEast6,
  usWest1,
  usWest2,
  usWest3,
  usWest4,
  usWest5,
  usWest6
];
