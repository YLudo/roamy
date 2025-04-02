import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface PaginationLayoutProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const PaginationLayout = ({ currentPage, totalPages, onPageChange }: PaginationLayoutProps) => {
    const getPageNumbers = () => {
        const pageNumbers = [];
        pageNumbers.push(1);

        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            if (pageNumbers[pageNumbers.length - 1] !== i - 1) {
                pageNumbers.push(-1);
            }
            pageNumbers.push(i);
        }

        if (totalPages > 1) {
            if (pageNumbers[pageNumbers.length - 1] !== totalPages - 1) {
                pageNumbers.push(-1);
            }
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    }

    const pageNumbers = getPageNumbers();

    return (
        <Pagination className="mt-4">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) onPageChange(currentPage - 1);
                        }}
                        aria-disabled={currentPage === 1}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
                {pageNumbers.map((pageNumber, index) => (
                    <PaginationItem key={index}>
                        {pageNumber === -1 ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(pageNumber);
                                }}
                                isActive={currentPage === pageNumber}
                            >
                                {pageNumber}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}
                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) onPageChange(currentPage + 1);
                        }}
                        aria-disabled={currentPage === totalPages}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

export default PaginationLayout;