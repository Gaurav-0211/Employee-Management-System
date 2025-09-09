// src/layouts/PublicLayout.jsx
import Header from "../components/Header";

export default function PublicLayout({ children }) {
  return (
    <>
      <Header />
      <div>{children}</div>
    </>
  );
}
