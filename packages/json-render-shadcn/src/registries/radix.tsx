"use client";

import { createShadcnComponents, type ShadcnPrimitiveSet } from "../components";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../generated/radix/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "../generated/radix/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "../generated/radix/ui/avatar";
import { Badge } from "../generated/radix/ui/badge";
import { Button } from "../generated/radix/ui/button";
import { ButtonGroup } from "../generated/radix/ui/button-group";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../generated/radix/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "../generated/radix/ui/carousel";
import { Checkbox } from "../generated/radix/ui/checkbox";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../generated/radix/ui/collapsible";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../generated/radix/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "../generated/radix/ui/drawer";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../generated/radix/ui/dropdown-menu";
import { Input } from "../generated/radix/ui/input";
import { Label } from "../generated/radix/ui/label";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "../generated/radix/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "../generated/radix/ui/popover";
import { Progress } from "../generated/radix/ui/progress";
import { RadioGroup, RadioGroupItem } from "../generated/radix/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../generated/radix/ui/select";
import { Separator } from "../generated/radix/ui/separator";
import { Skeleton } from "../generated/radix/ui/skeleton";
import { Slider } from "../generated/radix/ui/slider";
import { Switch } from "../generated/radix/ui/switch";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../generated/radix/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../generated/radix/ui/tabs";
import { Textarea } from "../generated/radix/ui/textarea";
import { Toggle } from "../generated/radix/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "../generated/radix/ui/toggle-group";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../generated/radix/ui/tooltip";
import { radixAdditionalPrimitives } from "./radix-additional";

const radixPrimitives = {
	...radixAdditionalPrimitives,
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Alert,
	AlertDescription,
	AlertTitle,
	Avatar,
	AvatarFallback,
	AvatarImage,
	Badge,
	Button,
	ButtonGroup,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	Checkbox,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Input,
	Label,
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Progress,
	RadioGroup,
	RadioGroupItem,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Separator,
	Skeleton,
	Slider,
	Switch,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Textarea,
	Toggle,
	ToggleGroup,
	ToggleGroupItem,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} satisfies ShadcnPrimitiveSet;

export function createRadixComponents(...overrides: Partial<ShadcnPrimitiveSet>[]) {
	return createShadcnComponents(Object.assign({}, radixPrimitives, ...overrides), {
		base: "radix",
	});
}

export const radixComponents = createRadixComponents();
