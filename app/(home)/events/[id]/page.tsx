interface PageProps {
  params: {
    id: string;
  };
}
export default async function EventIdPage({ params }: PageProps) {
  const { id } = await params;
  return <div>{id}</div>;
}
