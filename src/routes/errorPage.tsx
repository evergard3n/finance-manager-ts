import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError() as {statusText?: string; message?: string};
  

  return (
    <div className="bg-white flex justify-center items-center flex-col h-dvh gap-8">
      <h1 className="font-bold text-5xl">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}