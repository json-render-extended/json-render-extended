"use client";

import type { ComponentProps, ElementType } from "react";

import { createShadcnComponents, type ShadcnPrimitiveSet } from "../components";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../generated/react-aria/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "../generated/react-aria/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "../generated/react-aria/ui/avatar";
import { Badge } from "../generated/react-aria/ui/badge";
import { Button } from "../generated/react-aria/ui/button";
import { ButtonGroup } from "../generated/react-aria/ui/button-group";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../generated/react-aria/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "../generated/react-aria/ui/carousel";
import { Checkbox } from "../generated/react-aria/ui/checkbox";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../generated/react-aria/ui/collapsible";
import {
	Dialog,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../generated/react-aria/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "../generated/react-aria/ui/drawer";
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../generated/react-aria/ui/dropdown-menu";
import { Input } from "../generated/react-aria/ui/input";
import { Label } from "../generated/react-aria/ui/label";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "../generated/react-aria/ui/pagination";
import { Popover, PopoverTrigger } from "../generated/react-aria/ui/popover";
import { Progress } from "../generated/react-aria/ui/progress";
import { RadioGroup, RadioGroupItem } from "../generated/react-aria/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../generated/react-aria/ui/select";
import { Separator } from "../generated/react-aria/ui/separator";
import { Skeleton } from "../generated/react-aria/ui/skeleton";
import { Slider } from "../generated/react-aria/ui/slider";
import { Switch } from "../generated/react-aria/ui/switch";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../generated/react-aria/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../generated/react-aria/ui/tabs";
import { Textarea } from "../generated/react-aria/ui/textarea";
import { Toggle } from "../generated/react-aria/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "../generated/react-aria/ui/toggle-group";
import { Tooltip, TooltipTrigger } from "../generated/react-aria/ui/tooltip";
import { reactAriaAdditionalPrimitives } from "./react-aria-additional";

type ReactAriaButtonBridgeProps = Omit<ComponentProps<typeof Button>, "isDisabled" | "onPress"> & {
	disabled?: boolean;
	onClick?: () => void;
};

function createReactAriaButtonBridge(ButtonPrimitive: ElementType) {
	return function ReactAriaButtonBridge({
		disabled,
		onClick,
		...props
	}: ReactAriaButtonBridgeProps) {
		return <ButtonPrimitive {...props} isDisabled={disabled} onPress={onClick} />;
	};
}

const reactAriaPrimitives = {
	...reactAriaAdditionalPrimitives,
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
	DialogDescription,
	DialogHeader,
	DialogTitle,
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DropdownMenu,
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
	TooltipTrigger,
} satisfies ShadcnPrimitiveSet;

export function createReactAriaComponents(...overrides: Partial<ShadcnPrimitiveSet>[]) {
	const primitives = Object.assign({}, reactAriaPrimitives, ...overrides);
	return createShadcnComponents(
		{
			...primitives,
			Button: createReactAriaButtonBridge(primitives.Button),
		},
		{ base: "react-aria" },
	);
}

export const reactAriaComponents = createReactAriaComponents();
