import React, { useMemo, useState } from "react";
import {
  Filter,
  SortAsc,
  SortDesc,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  BarChart3,
  GitBranch,
  Zap,
  Lock,
} from "lucide-react";
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useExpanded,
} from "react-table";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

export function AdvancedDataTable({
  data,
  columns,
  onRowClick,
  onSelectionChange,
  enableVirtualization = true,
  enableBatchOperations = true,
}) {
  const [globalFilter, setGlobalFilter] = useState("");

  const enhancedColumns = useMemo(
    () => [
      {
        id: "selection",
        Header: ({ getToggleAllRowsSelectedProps }) => (
          <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
        ),
        Cell: ({ row }) => (
          <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
        ),
        width: 50,
      },
      ...columns,
      {
        id: "actions",
        Header: "Actions",
        Cell: ({ row }) => <ActionMenu row={row.original} />,
        width: 100,
        disableSortBy: true,
      },
    ],
    [columns]
  );

  const tableInstance = useTable(
    {
      columns: enhancedColumns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: 50,
        sortBy: [{ id: "carbon", desc: true }],
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((cols) => [
        ...cols,
        {
          id: "expander",
          Header: () => null,
          Cell: ({ row }) => <ExpandButton row={row} />,
        },
      ]);
    }
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    selectedFlatRows,
    state,
  } = tableInstance;

  const RowRenderer = ({ index, style }) => {
    const row = rows[index];
    prepareRow(row);

    return (
      <div
        {...row.getRowProps({ style })}
        className={`table-row ${row.isSelected ? "selected" : ""}`}
        onClick={() => onRowClick?.(row.original)}
      >
        {row.cells.map((cell) => (
          <div {...cell.getCellProps()} className="table-cell">
            {cell.render("Cell")}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="advanced-data-table">
      <div className="table-toolbar">
        <div className="toolbar-left">
          <GlobalSearch value={globalFilter} onChange={setGlobalFilter} />
          <ColumnVisibilityMenu columns={enhancedColumns} />
          <FilterPresets onApply={handleFilterApply} />
        </div>

        <div className="toolbar-right">
          <ExportMenu data={selectedFlatRows.map((d) => d.original)} />
          <BatchOperationsMenu
            selected={selectedFlatRows}
            operations={BATCH_OPERATIONS}
          />
          <DataQualityIndicator quality={calculateDataQuality()} />
        </div>
      </div>

      <div className="table-container" style={{ height: "calc(100vh - 200px)" }}>
        {enableVirtualization ? (
          <AutoSizer>
            {({ height, width }) => (
              <List height={height} itemCount={rows.length} itemSize={50} width={width}>
                {RowRenderer}
              </List>
            )}
          </AutoSizer>
        ) : (
          <div {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <div {...row.getRowProps()} className="table-row">
                  {row.cells.map((cell) => (
                    <div {...cell.getCellProps()} className="table-cell">
                      {cell.render("Cell")}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="table-pagination">
        <div className="pagination-info">
          <span>
            Showing {state.pageIndex * state.pageSize + 1} to{" "}
            {Math.min((state.pageIndex + 1) * state.pageSize, data.length)} of{" "}
            {data.length} entries
          </span>
          <span className="selection-count">{selectedFlatRows.length} selected</span>
        </div>

        <div className="pagination-controls">
          <PageSizeSelector value={state.pageSize} onChange={setPageSize} options={[10, 25, 50, 100]} />

          <nav className="page-navigation">
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              First
            </button>
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              Previous
            </button>
            <PageInput pageCount={pageCount} currentPage={state.pageIndex} onPageChange={gotoPage} />
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              Next
            </button>
            <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
              Last
            </button>
          </nav>
        </div>
      </div>

      <div className="table-summary">
        <SummaryStat label="Total Carbon" value={calculateTotalCarbon(selectedFlatRows)} unit="kg CO2e" format="carbon" />
        <SummaryStat label="Average Circularity" value={calculateAverageCircularity(selectedFlatRows)} unit="/100" format="percentage" />
        <SummaryStat label="Cost Impact" value={calculateCostImpact(selectedFlatRows)} unit="%" format="currency" />
        <SummaryStat label="Risk Score" value={calculateRiskScore(selectedFlatRows)} unit="/10" format="risk" />
      </div>
    </div>
  );
}

const CarbonCell = ({ value }) => {
  const rating = getCarbonRating(value);
  const color = getCarbonColor(value);
  return (
    <div className="carbon-cell">
      <div className="carbon-value">{value.toFixed(2)}</div>
      <div className="carbon-badge" style={{ backgroundColor: color }}>
        {rating}
      </div>
      <Sparkline data={getHistoricalCarbon()} color={color} />
    </div>
  );
};

const ActionMenu = ({ row }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="action-menu">
      <button type="button" onClick={() => setIsOpen(!isOpen)}>
        <MoreVertical size={16} />
      </button>
      {isOpen && (
        <div className="action-dropdown">
          <button type="button" onClick={() => handleView(row)}>
            <Eye size={14} />
            View Details
          </button>
          <button type="button" onClick={() => handleEdit(row)}>
            <Edit size={14} />
            Edit
          </button>
          <button type="button" onClick={() => handleAnalyze(row)}>
            <BarChart3 size={14} />
            Analyze
          </button>
          <button type="button" onClick={() => handleCompare(row)}>
            <GitBranch size={14} />
            Compare
          </button>
          <button type="button" onClick={() => handleOptimize(row)}>
            <Zap size={14} />
            Optimize
          </button>
          <hr />
          <button type="button" onClick={() => handleDelete(row)} className="danger">
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef = ref || defaultRef;

  React.useEffect(() => {
    if (resolvedRef.current) {
      resolvedRef.current.indeterminate = indeterminate;
    }
  }, [resolvedRef, indeterminate]);

  return <input type="checkbox" ref={resolvedRef} {...rest} />;
});

const ExpandButton = ({ row }) => (
  <button type="button" onClick={() => row.toggleRowExpanded()}>
    {row.isExpanded ? "-" : "+"}
  </button>
);

const GlobalSearch = ({ value, onChange }) => (
  <input
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder="Search"
  />
);

const ColumnVisibilityMenu = () => <button type="button">Columns</button>;
const FilterPresets = () => <button type="button">Presets</button>;
const ExportMenu = () => <button type="button">Export</button>;
const BatchOperationsMenu = () => <button type="button">Batch</button>;
const DataQualityIndicator = () => <div className="data-quality">Quality</div>;
const PageSizeSelector = ({ value, onChange, options }) => (
  <select value={value} onChange={(e) => onChange(Number(e.target.value))}>
    {options.map((opt) => (
      <option key={opt} value={opt}>
        {opt}
      </option>
    ))}
  </select>
);
const PageInput = ({ pageCount, currentPage, onPageChange }) => (
  <input
    type="number"
    min={1}
    max={pageCount}
    value={currentPage + 1}
    onChange={(e) => onPageChange(Number(e.target.value) - 1)}
  />
);
const SummaryStat = ({ label, value, unit }) => (
  <div className="summary-stat">
    <span>{label}</span>
    <strong>
      {value} {unit}
    </strong>
  </div>
);

const Sparkline = () => <span className="sparkline" />;

const getHistoricalCarbon = () => [1, 2, 3, 2, 1];
const getCarbonRating = (value) => (value < 0.5 ? "A" : value < 2 ? "C" : "F");
const getCarbonColor = (value) => (value < 0.5 ? "#00B894" : value < 2 ? "#FDCB6E" : "#E17055");

const handleFilterApply = () => {};
const calculateDataQuality = () => 0.93;
const calculateTotalCarbon = () => 0;
const calculateAverageCircularity = () => 0;
const calculateCostImpact = () => 0;
const calculateRiskScore = () => 0;
const handleView = () => {};
const handleEdit = () => {};
const handleAnalyze = () => {};
const handleCompare = () => {};
const handleOptimize = () => {};
const handleDelete = () => {};

const BATCH_OPERATIONS = [];
