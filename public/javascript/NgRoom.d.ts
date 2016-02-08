declare var NgRoom: NgRoom;

declare module "NgRoom" {
  export = NgRoom;
}

interface NgRoom
{
  new(conn:string, gamecallback: () => void): NgRoom;
  dataToServer(data: any): void;
  getMyID(): string;
}
