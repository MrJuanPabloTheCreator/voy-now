import Image from "next/image";

const AuthLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="flex justify-center items-center relative" style={{ backgroundImage: "url('/field_2.jpeg')", 
      backgroundSize: 'cover', backgroundPosition: 'center', width: '100%',height: '100vh',}}
    >
      <div className="absolute inset-0 backdrop-blur-lg bg-black/20"/>
      <div className="z-20">
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;