import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import DataTable from '@/components/Datatable';

// Mock Data Generator
const generateMockData = (entity) => {
  return Array.from({ length: 45 }).map((_, i) => ({
    id: i + 1,
    name: `${entity === 'Patients' ? 'Patient' : 'Record'} ${i + 1}`,
    email: `contact${i + 1}@example.com`,
    status: i % 3 === 0 ? 'Pending' : 'Active',
    date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
  }));
};

export default function ListingPage({ entity = 'Items', role = 'Admin' }) {
  // const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  // const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  // Simulate API Call with "Server-Side" features
  // const fetchServerData = async (page, limit, searchQuery, sort) => {
  //   setLoading(true);
  //   // Simulate network delay
  //   await new Promise(resolve => setTimeout(resolve, 600));

  //   let allData = generateMockData(entity);

  //   // 1. Search
  //   if (searchQuery) {
  //     allData = allData.filter(item =>
  //       item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       item.email.toLowerCase().includes(searchQuery.toLowerCase())
  //     );
  //   }

  //   // 2. Sort
  //   allData.sort((a, b) => {
  //     if (a[sort.key] < b[sort.key]) return sort.direction === 'asc' ? -1 : 1;
  //     if (a[sort.key] > b[sort.key]) return sort.direction === 'asc' ? 1 : -1;
  //     return 0;
  //   });

  //   // 3. Paginate
  //   const total = allData.length;
  //   const paginatedData = allData.slice((page - 1) * limit, page * limit);

  //   setData(paginatedData);
  //   setPagination({ page, limit, total });
  //   setLoading(false);
  // };

  // // useEffect(() => {
  // //   // Debounce search
  // //   const handler = setTimeout(() => {
  // //     fetchServerData(1, pagination.limit, search, sortConfig);
  // //   }, 500);

  //   return () => clearTimeout(handler);
  // }, [search, sortConfig, entity]);

  // const handlePageChange = (newPage) => {
  //   fetchServerData(newPage, pagination.limit, search, sortConfig);
  // };

  // const handleSort = (key) => {
  //   let direction = 'asc';
  //   if (sortConfig.key === key && sortConfig.direction === 'asc') {
  //     direction = 'desc';
  //   }
  //   setSortConfig({ key, direction });
  // };

  // const totalPages = Math.ceil(pagination.total / pagination.limit);

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const fetchData = async (params) => {
    setLoading(true);
    // Fetch from backend with params: { page, limit, sort, order, search }
    const response = await fetch(`/api/appointments?${new URLSearchParams(params)}`);
    const result = await response.json();
    setData(result.data);
    setPagination(result.pagination);
    setLoading(false);
  };

  const handlePageChange = (page) => {
    fetchData({ ...getCurrentParams(), page });
  };

  const handleSort = (key, direction) => {
    fetchData({ ...getCurrentParams(), sort: key, order: direction });
  };

  const handleSearch = (query) => {
    fetchData({ ...getCurrentParams(), search: query, page: 1 });
  };

  const handleAction = (action, row) => {
    if (action === 'view') console.log('View', row);
    if (action === 'edit') console.log('Edit', row);
    if (action === 'delete') console.log('Delete', row);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{entity} Management</h1>
        <p className="text-muted-foreground">Manage and view all {entity.toLowerCase()} in the system.</p>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder={`Search ${entity.toLowerCase()}...`}
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              Add New {entity}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <DataTable
            columns={columns}
            data={data}
            pagination={pagination}
            onPageChange={handlePageChange}
            onSort={handleSort}
            onSearch={handleSearch}
            onAction={handleAction}
            loading={loading}
            title="Appointments"
            searchPlaceholder="Search patients, doctors..."
          />
          {/* <div className="rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                <TableRow>
                  {['id', 'name', 'email', 'status', 'date'].map((key) => (
                    <TableHead
                      key={key}
                      className="cursor-pointer select-none"
                      onClick={() => handleSort(key)}
                    >
                      <div className="flex items-center">
                        <span className="capitalize">{key}</span>
                        {sortConfig.key === key ? (
                          sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                        ) : (
                          <div className="w-5" /> // Spacer
                        )}
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-teal-600" />
                    </TableCell>
                  </TableRow>
                ) : data.length > 0 ? (
                  data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div> */}

          {/* Pagination */}
          {/* <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4 text-center sm:text-left">
            <p className="text-sm text-slate-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1 || loading}
              >
                Previous
              </Button>
              <div className="text-sm font-medium whitespace-nowrap">Page {pagination.page} of {totalPages || 1}</div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= totalPages || loading}
              >
                Next
              </Button>
            </div>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
