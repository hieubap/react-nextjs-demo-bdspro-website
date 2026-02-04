'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, RefreshCw, AlertTriangle, ArrowLeft } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    // console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-orange-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Lỗi hệ thống
            </CardTitle>
            <CardDescription className="text-gray-600">
              Đã xảy ra lỗi không mong muốn. Chúng tôi đang khắc phục sự cố này.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-gray-500">
              <p>Hệ thống đang gặp sự cố tạm thời. Vui lòng thử lại sau ít phút.</p>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs text-red-800 font-mono">
                  {error.message}
                </p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={reset} className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                Thử lại
              </Button>
              
              <Button variant="outline" asChild className="flex-1">
                <Link href="/" className="flex items-center justify-center gap-2">
                  <Home className="w-4 h-4" />
                  Về trang chủ
                </Link>
              </Button>
            </div>
            
            <div className="text-center">
              <Button 
                // variant="ghost" 
                // onClick={() => window.history.back()}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Quay lại trang trước
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Nếu lỗi vẫn tiếp tục xảy ra, vui lòng{' '}
            <Link href="/contact" className="text-blue-600 hover:text-blue-800 underline">
              liên hệ với chúng tôi
            </Link>
            {' '}để được hỗ trợ.
          </p>
        </div>
      </div>
    </div>
  )
}
