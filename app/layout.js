export const metadata = {
  title: "Smart Line Multiplication Game",
  description: "เกมพหุนามประยุกต์เส้นญี่ปุ่น - ฝึกคูณพหุนามด้วยวิธีตาราง",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}