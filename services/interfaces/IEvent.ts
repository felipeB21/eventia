export interface IEvent {
  id: string;
  title: string;
  description: string | null;
  location: string;
  image: string;
  status: ["active" | "canceled" | "finished"];
  eventVerified: boolean;
  creatorId: string;
  startsAt: Date;
  endsAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
