import LocaleSwitcher from "./LocaleSwitcher";

export default function Navbar() {
  return (
    <div className='z-50 p-4 ml-20'>
      <LocaleSwitcher />
    </div>
  );
}