import axios from "axios";

export const axiosClient = axios.create({
  baseURL:
    "http://smartsetter-agent-portal-backend-env.eba-wd3dw42f.us-west-2.elasticbeanstalk.com/",
});

export function createStorageKey(key) {
  return `agentPortal.${key}`;
}

export function getFileExtension(filename) {
  return filename.split(".").pop();
}
