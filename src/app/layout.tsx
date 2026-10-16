import type { Metadata } from "next"
import { Vazirmatn } from "next/font/google"
import "./globals.css"
import { DirectionProvider } from "@/components/ui/direction"

const vazirmatn = Vazirmatn({
  variable: "--font-sans",
  subsets: ["arabic","latin"],
})



export const metadata: Metadata = {
  title: "داشبورد مدیریت کاربران",
  description: "تسک داشبورد مدیریت کاربران انجام شده توسط آیسان شجاع پور",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} ${vazirmatn.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <DirectionProvider dir="rtl">

        {children}
        </DirectionProvider>
        
        </body>
    </html>
  )
}
