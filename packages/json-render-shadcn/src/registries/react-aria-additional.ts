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
} from "../generated/react-aria/ui/alert-dialog";
import { AspectRatio } from "../generated/react-aria/ui/aspect-ratio";
import {
	Attachment,
	AttachmentContent,
	AttachmentDescription,
	AttachmentMedia,
	AttachmentTitle,
} from "../generated/react-aria/ui/attachment";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
} from "../generated/react-aria/ui/breadcrumb";
import {
	Bubble,
	BubbleContent,
	BubbleGroup,
	BubbleReactions,
} from "../generated/react-aria/ui/bubble";
import { Calendar } from "../generated/react-aria/ui/calendar";
import { ChartContainer } from "../generated/react-aria/ui/chart";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "../generated/react-aria/ui/combobox";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandShortcut,
} from "../generated/react-aria/ui/command";
import {
	ContextMenu,
	ContextMenuItem,
	ContextMenuTrigger,
} from "../generated/react-aria/ui/context-menu";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "../generated/react-aria/ui/empty";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "../generated/react-aria/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from "../generated/react-aria/ui/input-group";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../generated/react-aria/ui/input-otp";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "../generated/react-aria/ui/item";
import { Kbd, KbdGroup } from "../generated/react-aria/ui/kbd";
import { Marker, MarkerContent } from "../generated/react-aria/ui/marker";
import {
	Message,
	MessageAvatar,
	MessageContent,
	MessageFooter,
	MessageGroup,
	MessageHeader,
} from "../generated/react-aria/ui/message";
import {
	MessageScroller,
	MessageScrollerContent,
	MessageScrollerProvider,
	MessageScrollerViewport,
} from "../generated/react-aria/ui/message-scroller";
import { NativeSelect, NativeSelectOption } from "../generated/react-aria/ui/native-select";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "../generated/react-aria/ui/resizable";
import { ScrollArea } from "../generated/react-aria/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "../generated/react-aria/ui/sheet";
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
} from "../generated/react-aria/ui/sidebar";
import { Toaster } from "../generated/react-aria/ui/sonner";

export const reactAriaAdditionalPrimitives: Partial<
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
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
	ScrollArea,
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
