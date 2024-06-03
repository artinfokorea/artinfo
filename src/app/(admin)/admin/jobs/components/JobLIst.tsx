"use client"

import { useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import JobTable from "@/components/ui/Table/JobTable"
import useSupabase from "@/hooks/useSupabase"
import { Pagination } from "@/components/common/Pagination"
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  getSortedRowModel,
  ColumnDef,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { jobsKeys } from "@/lib/queries/jobs"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination"
import { fetchJobs } from "../api"

type JOBS = {
  id: number
  title: string
  category: string
}

const columns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        id="header-checkbox"
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()} // 전체 row가 선택되었는지 확인
        onChange={table.getToggleAllPageRowsSelectedHandler()} // 전체 row를 선택/해제하는 handler
      />
    ),
    cell: ({ row }) => (
      <input
        id={`cell-checkbox-${row.id}`}
        type="checkbox"
        checked={row.getIsSelected()} // row가 선택되었는지 확인
        disabled={!row.getCanSelect()} // row가 선택 가능한지 확인
        onChange={row.getToggleSelectedHandler()} // row를 선택/해제하는 handler
      />
    ),
    size: 50,
  },
  {
    header: "id",
    accessorKey: "id",
  },
  {
    header: "title",
    accessorKey: "title",
  },
  {
    header: "category",
    accessorKey: "category",
  },
]

export default function JobList() {
  const searchParams = useSearchParams()
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: Number(searchParams.get("page")) || 0,
    pageSize: 20,
  })
  const [rowSelection, setRowSelection] = useState({})
  const pathname = usePathname()
  const router = useRouter()

  const supabase = useSupabase()

  const { data: jobList, refetch } = useQuery(
    jobsKeys.list({ page: pageIndex + 1 }),
  )

  const pageCount = Math.ceil((jobList?.count || 0) / pageSize)
  const pagination = useMemo(() => {
    return {
      pageIndex,
      pageSize,
    }
  }, [pageIndex, pageSize])

  const table = useReactTable({
    columns,
    data: jobList?.jobs || [],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    pageCount,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: false,
    state: {
      pagination,
      rowSelection,
    },
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    // onSortingChange: setSorting,
    // onColumnFiltersChange: setColumnFilters,
  })

  // const ths = [
  //   { title: "번호", value: "id" },
  //   { title: "제목", value: "title" },
  // ]

  const deleteJob = async (id: number) => {
    try {
      const { error } = await supabase
        .from("recruit_jobs")
        .delete()
        .eq("id", id)

      if (error) {
        throw new Error("삭제실패")
      }
      refetch()
    } catch (error: any) {
      throw new Error("삭제실패")
    }
  }

  return (
    <div>
      {/* {jobs && (
        <>
          <JobTable
            ths={ths}
            items={jobs.jobs}
            to="jobs"
            handleDelete={deleteJob}
          />
          <Pagination
            page={page}
            setPage={setPage}
            totalCount={jobs?.count as number}
          />
        </>
      )} */}
      <div className="rounded-md">
        <Table className="border-collapse">
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-xs font-bold bg-[ghostwhite] dark:bg-[#2e313d] text-black dark:text-white whitespace-nowrap"
                      style={{ width: header.getSize() }}
                    >
                      <div className="flex items-center">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                        {/* {header.column.getIsSorted() === "asc" ? (
                          <ChevronUp />
                        ) : header.column.getIsSorted() === "desc" ? (
                          <ChevronDown />
                        ) : null}
                        {header.column.getCanSort() &&
                        !header.column.getIsSorted() ? (
                          <ChevronsUpDown />
                        ) : null} */}
                      </div>
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map(cell => (
                  <TableCell
                    key={cell.id}
                    className="text-xs whitespace-nowrap"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination
        totalCount={table.getPageCount()}
        page={table.getState().pagination.pageIndex + 1}
        setPage={(pageIndex: number) => {
          table.setPageIndex(pageIndex - 1)
          router.push(`${pathname}?page=${pageIndex - 1}`)
        }}
      />
    </div>
  )
}
