"use client"

interface PaginationProps {
  activePage: number
  setActivePage: (page: number) => void
  totalPages: number
}

export default function Pagination({ activePage, setActivePage, totalPages }: PaginationProps) {
  return (
    <div className="flex justify-between items-center mt-8">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((page) => (
          <button
            key={page}
            className={`w-8 h-8 flex items-center justify-center rounded border ${
              activePage === page
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => setActivePage(page)}
          >
            {page}
          </button>
        ))}
        <span className="w-8 h-8 flex items-center justify-center">...</span>
        <button className="px-3 h-8 flex items-center justify-center rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-50">
          {totalPages}
        </button>
        <button className="px-3 h-8 flex items-center justify-center rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 ml-1">
          Next
        </button>
      </div>

      <div className="flex items-center text-sm">
        <button className="w-8 h-8 flex items-center justify-center rounded border bg-orange-500 text-white border-orange-500">
          15
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 ml-1">
          30
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 ml-1">
          50
        </button>
        <span className="ml-2 text-gray-600">per page</span>
      </div>
    </div>
  )
}

