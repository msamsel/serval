import dotenv from "dotenv";

interface HttpServerConfigurationV1 {
  version: "1";
  port: number;
  hostname: string;
}

dotenv.config();

export type HttpServerConfiguration = HttpServerConfigurationV1;

export const getDefault = (): HttpServerConfiguration => {
  const port = Number(process.env.PORT) || 3000;
  if (Number.isNaN(port) || port < 1 || port > 65535) {
    throw new Error(
      `This is not allowed port number: ${port}. Please use number in range 1-65535`,
    );
  }

  return {
    version: "1",
    port,
    hostname: process.env.HOSTNAME || "localhost",
  };
};
