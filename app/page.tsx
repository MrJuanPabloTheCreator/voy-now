import DisplayFacilities from "./_components/display_facilities";
import ImageUpload from "./_components/image_upload";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen justify-center items-center space-y-5">
      <ImageUpload/>
      <DisplayFacilities/>
    </main>
  );
}
