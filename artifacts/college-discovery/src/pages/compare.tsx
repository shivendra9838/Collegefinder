import { useState } from "react";
import { useListColleges, useCompareColleges } from "@workspace/api-client-react";
import { Check, ChevronsUpDown, X, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Compare() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Search query for the dropdown
  const { data: searchResults, isLoading: searching } = useListColleges(
    { search, limit: 10 },
    { query: { enabled: open, queryKey: ["colleges-search", search] } }
  );

  const compareMutation = useCompareColleges();

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(x => x !== id));
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds(prev => [...prev, id]);
      }
    }
  };

  const handleCompare = () => {
    if (selectedIds.length >= 2) {
      compareMutation.mutate({ collegeIds: selectedIds });
    }
  };

  const comparedColleges = compareMutation.data?.colleges;

  const ValueCell = ({ value, type }: { value: string | number | boolean, type?: 'good-high' | 'good-low' | 'boolean' }) => {
    if (typeof value === 'boolean') {
      return (
        <span className={cn("font-medium", value ? "text-green-600" : "text-red-500")}>
          {value ? "Yes" : "No"}
        </span>
      );
    }
    return <span className="font-medium text-foreground">{value}</span>;
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-4rem)]">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-display font-bold mb-4">Compare Colleges Side-by-Side</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Select up to 3 colleges to compare their fees, placements, ratings, and facilities.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 bg-muted/30 p-6 rounded-2xl border border-dashed">
          <div className="w-full sm:w-80">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between bg-background h-12 text-base"
                  disabled={selectedIds.length >= 3}
                >
                  {selectedIds.length >= 3 ? "Maximum 3 selected" : "Search to add college..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command shouldFilter={false}>
                  <CommandInput 
                    placeholder="Type college name..." 
                    value={search}
                    onValueChange={setSearch}
                  />
                  <CommandList>
                    <CommandEmpty>{searching ? "Searching..." : "No college found."}</CommandEmpty>
                    <CommandGroup>
                      {searchResults?.colleges.map((college) => (
                        <CommandItem
                          key={college.id}
                          value={college.name}
                          onSelect={() => handleSelect(college.id)}
                          className="flex items-center justify-between"
                        >
                          <span className="truncate mr-2">{college.name}</span>
                          <Check
                            className={cn(
                              "h-4 w-4 shrink-0",
                              selectedIds.includes(college.id) ? "opacity-100 text-primary" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          
          <Button 
            size="lg" 
            className="h-12 px-8 w-full sm:w-auto"
            disabled={selectedIds.length < 2 || compareMutation.isPending}
            onClick={handleCompare}
          >
            {compareMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>Compare Now <ArrowRight className="ml-2 h-4 w-4" /></>
            )}
          </Button>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {selectedIds.map(id => (
              <Badge key={id} variant="secondary" className="px-3 py-1.5 text-sm gap-2 bg-primary/10 text-primary hover:bg-primary/20">
                College ID: {id}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => {
                    setSelectedIds(prev => prev.filter(x => x !== id));
                    if (comparedColleges && comparedColleges.length > 0) {
                      // clear comparison if modified
                      compareMutation.reset();
                    }
                  }}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {comparedColleges && comparedColleges.length > 0 && (
        <div className="mt-16 overflow-x-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
          <Card className="border-primary/20 shadow-xl overflow-hidden min-w-[800px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-6 bg-muted/30 border-b border-r w-1/4 align-bottom">
                    <span className="text-muted-foreground font-semibold uppercase tracking-wider text-xs">Comparison Criteria</span>
                  </th>
                  {comparedColleges.map((college) => (
                    <th key={college.id} className="p-6 bg-background border-b w-1/4 border-r last:border-r-0">
                      <div className="h-16 mb-4 rounded-lg overflow-hidden relative">
                        <img src={college.imageUrl || "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=500&auto=format&fit=crop"} alt={college.name} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="font-display font-bold text-lg leading-tight mb-2 text-primary">{college.name}</h3>
                      <Badge variant="outline">{college.type}</Badge>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 border-r font-medium text-muted-foreground bg-muted/5">Location</td>
                  {comparedColleges.map((c) => (
                    <td key={c.id} className="p-4 border-r last:border-r-0"><ValueCell value={`${c.location}, ${c.state}`} /></td>
                  ))}
                </tr>
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 border-r font-medium text-muted-foreground bg-muted/5">Rating</td>
                  {comparedColleges.map((c) => (
                    <td key={c.id} className="p-4 border-r last:border-r-0">
                      <span className="flex items-center gap-1 font-bold">
                        <ValueCell value={c.rating.toFixed(1)} /> <span className="text-yellow-500">★</span>
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 border-r font-medium text-muted-foreground bg-muted/5">Total Fees (Approx)</td>
                  {comparedColleges.map((c) => (
                    <td key={c.id} className="p-4 border-r last:border-r-0">
                      <ValueCell value={`₹${(c.totalFees / 100000).toFixed(2)} Lakhs`} />
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 border-r font-medium text-muted-foreground bg-muted/5">Placement Rate</td>
                  {comparedColleges.map((c) => (
                    <td key={c.id} className="p-4 border-r last:border-r-0">
                      <span className="text-green-600 font-bold">{c.placementPercentage}%</span>
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 border-r font-medium text-muted-foreground bg-muted/5">Average Package</td>
                  {comparedColleges.map((c) => (
                    <td key={c.id} className="p-4 border-r last:border-r-0">
                      <ValueCell value={`₹${(c.avgPackage / 100000).toFixed(2)} LPA`} />
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 border-r font-medium text-muted-foreground bg-muted/5">Hostel Facility</td>
                  {comparedColleges.map((c) => (
                    <td key={c.id} className="p-4 border-r last:border-r-0"><ValueCell value={c.hostelAvailable} type="boolean" /></td>
                  ))}
                </tr>
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 border-r font-medium text-muted-foreground bg-muted/5">Scholarships</td>
                  {comparedColleges.map((c) => (
                    <td key={c.id} className="p-4 border-r last:border-r-0"><ValueCell value={c.scholarshipAvailable} type="boolean" /></td>
                  ))}
                </tr>
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 border-r font-medium text-muted-foreground bg-muted/5">Exams Accepted</td>
                  {comparedColleges.map((c) => (
                    <td key={c.id} className="p-4 border-r last:border-r-0">
                      <div className="flex flex-wrap gap-1">
                        {c.examAccepted.map(e => <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>)}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </div>
  );
}
