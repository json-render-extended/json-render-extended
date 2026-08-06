import type { ElementType } from "react";

import type { AdditionalShadcnPrimitiveName } from "../components/types";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../generated/base-ui/ui/alert-dialog";
import { AspectRatio } from "../generated/base-ui/ui/aspect-ratio";
import {
	Attachment,
	AttachmentContent,
	AttachmentDescription,
	AttachmentMedia,
	AttachmentTitle,
} from "../generated/base-ui/ui/attachment";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "../generated/base-ui/ui/breadcrumb";
import {
	Bubble,
	BubbleContent,
	BubbleGroup,
	BubbleReactions,
} from "../generated/base-ui/ui/bubble";
import { Calendar } from "../generated/base-ui/ui/calendar";
import { ChartContainer } from "../generated/base-ui/ui/chart";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "../generated/base-ui/ui/combobox";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandShortcut,
} from "../generated/base-ui/ui/command";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "../generated/base-ui/ui/context-menu";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "../generated/base-ui/ui/empty";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "../generated/base-ui/ui/field";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../generated/base-ui/ui/hover-card";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from "../generated/base-ui/ui/input-group";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../generated/base-ui/ui/input-otp";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "../generated/base-ui/ui/item";
import { Kbd, KbdGroup } from "../generated/base-ui/ui/kbd";
import { Marker, MarkerContent } from "../generated/base-ui/ui/marker";
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarTrigger,
} from "../generated/base-ui/ui/menubar";
import {
	Message,
	MessageAvatar,
	MessageContent,
	MessageFooter,
	MessageGroup,
	MessageHeader,
} from "../generated/base-ui/ui/message";
import {
	MessageScroller,
	MessageScrollerContent,
	MessageScrollerProvider,
	MessageScrollerViewport,
} from "../generated/base-ui/ui/message-scroller";
import { NativeSelect, NativeSelectOption } from "../generated/base-ui/ui/native-select";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "../generated/base-ui/ui/navigation-menu";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "../generated/base-ui/ui/resizable";
import { ScrollArea, ScrollBar } from "../generated/base-ui/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "../generated/base-ui/ui/sheet";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
} from "../generated/base-ui/ui/sidebar";
import { Toaster } from "../generated/base-ui/ui/sonner";

export const baseUiAdditionalPrimitives: Partial<
	Record<AdditionalShadcnPrimitiveName, ElementType>
> = {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
	AspectRatio,
	Attachment,
	AttachmentContent,
	AttachmentDescription,
	AttachmentMedia,
	AttachmentTitle,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	Bubble,
	BubbleContent,
	BubbleGroup,
	BubbleReactions,
	Calendar,
	ChartContainer,
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandShortcut,
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldLabel,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
	Kbd,
	KbdGroup,
	Marker,
	MarkerContent,
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarTrigger,
	Message,
	MessageAvatar,
	MessageContent,
	MessageFooter,
	MessageGroup,
	MessageHeader,
	MessageScroller,
	MessageScrollerContent,
	MessageScrollerProvider,
	MessageScrollerViewport,
	NativeSelect,
	NativeSelectOption,
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
	ScrollArea,
	ScrollBar,
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	Toaster,
};
