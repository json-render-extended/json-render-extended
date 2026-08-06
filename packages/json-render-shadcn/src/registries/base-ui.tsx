"use client";

import { createShadcnComponents, type ShadcnPrimitiveSet } from "../components";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../generated/base-ui/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "../generated/base-ui/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "../generated/base-ui/ui/avatar";
import { Badge } from "../generated/base-ui/ui/badge";
import { Button } from "../generated/base-ui/ui/button";
import { ButtonGroup } from "../generated/base-ui/ui/button-group";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../generated/base-ui/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "../generated/base-ui/ui/carousel";
import { Checkbox } from "../generated/base-ui/ui/checkbox";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../generated/base-ui/ui/collapsible";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../generated/base-ui/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "../generated/base-ui/ui/drawer";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../generated/base-ui/ui/dropdown-menu";
import { Input } from "../generated/base-ui/ui/input";
import { Label } from "../generated/base-ui/ui/label";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "../generated/base-ui/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "../generated/base-ui/ui/popover";
import { Progress } from "../generated/base-ui/ui/progress";
import { RadioGroup, RadioGroupItem } from "../generated/base-ui/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../generated/base-ui/ui/select";
import { Separator } from "../generated/base-ui/ui/separator";
import { Skeleton } from "../generated/base-ui/ui/skeleton";
import { Slider } from "../generated/base-ui/ui/slider";
import { Switch } from "../generated/base-ui/ui/switch";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../generated/base-ui/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../generated/base-ui/ui/tabs";
import { Textarea } from "../generated/base-ui/ui/textarea";
import { Toggle } from "../generated/base-ui/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "../generated/base-ui/ui/toggle-group";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../generated/base-ui/ui/tooltip";
import { baseUiAdditionalPrimitives } from "./base-ui-additional";

const baseUiPrimitives = {
	...baseUiAdditionalPrimitives,
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

export function createBaseUiComponents(...overrides: Partial<ShadcnPrimitiveSet>[]) {
	return createShadcnComponents(Object.assign({}, baseUiPrimitives, ...overrides), {
		base: "base-ui",
	});
}

export const baseUiComponents = createBaseUiComponents();
