import { createAccordionComponent } from "./accordion";
import { createAlertComponent } from "./alert";
import { createAlertDialogComponent } from "./alert-dialog";
import { createAspectRatioComponent } from "./aspect-ratio";
import { createAttachmentComponent } from "./attachment";
import { createAvatarComponent } from "./avatar";
import { createBadgeComponent } from "./badge";
import { createBreadcrumbComponent } from "./breadcrumb";
import { createBubbleComponent } from "./bubble";
import { createButtonComponent } from "./button";
import { createButtonGroupComponent } from "./button-group";
import { createCalendarComponent } from "./calendar";
import { createCardComponent } from "./card";
import { createCarouselComponent } from "./carousel";
import { createChartComponent } from "./chart";
import { createCheckboxComponent } from "./checkbox";
import { createCollapsibleComponent } from "./collapsible";
import { createComboboxComponent } from "./combobox";
import { createCommandComponent } from "./command";
import { createContextMenuComponent } from "./context-menu";
import { createDialogComponent } from "./dialog";
import { createDirectionComponent } from "./direction";
import { createDrawerComponent } from "./drawer";
import { createDropdownMenuComponent } from "./dropdown-menu";
import { createEmptyComponent } from "./empty";
import { createFieldComponent } from "./field";
import { FormComponent } from "./form";
import { GridComponent } from "./grid";
import { HeadingComponent } from "./heading";
import { createHoverCardComponent } from "./hover-card";
import { ImageComponent } from "./image";
import { createInputComponent } from "./input";
import { createInputGroupComponent } from "./input-group";
import { createInputOtpComponent } from "./input-otp";
import { createItemComponent } from "./item";
import { createKbdComponent } from "./kbd";
import { createLabelComponent } from "./label";
import { LinkComponent } from "./link";
import { createMarkerComponent } from "./marker";
import { createMenubarComponent } from "./menubar";
import { createMessageComponent } from "./message";
import { createMessageScrollerComponent } from "./message-scroller";
import { createNativeSelectComponent } from "./native-select";
import { createNavigationMenuComponent } from "./navigation-menu";
import { createPaginationComponent } from "./pagination";
import { createPopoverComponent } from "./popover";
import { createProgressComponent } from "./progress";
import { createRadioComponent } from "./radio";
import { createResizableComponent } from "./resizable";
import { createScrollAreaComponent } from "./scroll-area";
import { createSelectComponent } from "./select";
import { createSeparatorComponent } from "./separator";
import { createSheetComponent } from "./sheet";
import { createSidebarComponent } from "./sidebar";
import { createSkeletonComponent } from "./skeleton";
import { createSliderComponent } from "./slider";
import { createSonnerComponent } from "./sonner";
import { SpinnerComponent } from "./spinner";
import { StackComponent } from "./stack";
import { createSwitchComponent } from "./switch";
import { createTableComponent } from "./table";
import { createTabsComponent } from "./tabs";
import { TextComponent } from "./text";
import { createTextareaComponent } from "./textarea";
import { createToastComponent } from "./toast";
import { createToggleComponent } from "./toggle";
import { createToggleGroupComponent } from "./toggle-group";
import { createTooltipComponent } from "./tooltip";
import type { CreateShadcnComponentsOptions, ShadcnPrimitiveSet } from "./types";

export type {
	AdditionalShadcnPrimitiveName,
	CreateShadcnComponentsOptions,
	ShadcnPrimitiveBase,
	ShadcnPrimitiveSet,
} from "./types";

export function createShadcnComponents(
	primitives: ShadcnPrimitiveSet,
	options: CreateShadcnComponentsOptions,
) {
	return {
		Accordion: createAccordionComponent(primitives, options),
		Alert: createAlertComponent(primitives),
		AlertDialog: createAlertDialogComponent(primitives),
		AspectRatio: createAspectRatioComponent(primitives),
		Attachment: createAttachmentComponent(primitives),
		Avatar: createAvatarComponent(primitives),
		Badge: createBadgeComponent(primitives),
		Breadcrumb: createBreadcrumbComponent(primitives),
		Bubble: createBubbleComponent(primitives),
		Button: createButtonComponent(primitives),
		ButtonGroup: createButtonGroupComponent(primitives),
		Card: createCardComponent(primitives),
		Carousel: createCarouselComponent(primitives),
		Calendar: createCalendarComponent(primitives),
		Chart: createChartComponent(primitives),
		Checkbox: createCheckboxComponent(primitives, options),
		Collapsible: createCollapsibleComponent(primitives, options),
		Combobox: createComboboxComponent(primitives, options),
		Command: createCommandComponent(primitives),
		ContextMenu: createContextMenuComponent(primitives, options),
		Dialog: createDialogComponent(primitives, options),
		Direction: createDirectionComponent(primitives),
		Drawer: createDrawerComponent(primitives),
		DropdownMenu: createDropdownMenuComponent(primitives, options),
		Empty: createEmptyComponent(primitives),
		Field: createFieldComponent(primitives),
		Form: FormComponent,
		Grid: GridComponent,
		Heading: HeadingComponent,
		HoverCard: createHoverCardComponent(primitives),
		Image: ImageComponent,
		Input: createInputComponent(primitives),
		InputGroup: createInputGroupComponent(primitives),
		InputOtp: createInputOtpComponent(primitives),
		Item: createItemComponent(primitives),
		Kbd: createKbdComponent(primitives),
		Label: createLabelComponent(primitives),
		Link: LinkComponent,
		Marker: createMarkerComponent(primitives),
		Menubar: createMenubarComponent(primitives),
		Message: createMessageComponent(primitives),
		MessageScroller: createMessageScrollerComponent(primitives),
		NativeSelect: createNativeSelectComponent(primitives),
		NavigationMenu: createNavigationMenuComponent(primitives),
		Pagination: createPaginationComponent(primitives),
		Popover: createPopoverComponent(primitives, options),
		Progress: createProgressComponent(primitives),
		Radio: createRadioComponent(primitives, options),
		Resizable: createResizableComponent(primitives),
		ScrollArea: createScrollAreaComponent(primitives),
		Select: createSelectComponent(primitives, options),
		Separator: createSeparatorComponent(primitives),
		Sheet: createSheetComponent(primitives, options),
		Sidebar: createSidebarComponent(primitives),
		Skeleton: createSkeletonComponent(primitives),
		Slider: createSliderComponent(primitives, options),
		Sonner: createSonnerComponent(primitives),
		Spinner: SpinnerComponent,
		Stack: StackComponent,
		Switch: createSwitchComponent(primitives, options),
		Table: createTableComponent(primitives),
		Tabs: createTabsComponent(primitives, options),
		Text: TextComponent,
		Textarea: createTextareaComponent(primitives),
		Toggle: createToggleComponent(primitives, options),
		ToggleGroup: createToggleGroupComponent(primitives, options),
		Toast: createToastComponent(primitives),
		Tooltip: createTooltipComponent(primitives, options),
	};
}

export type ShadcnComponents = ReturnType<typeof createShadcnComponents>;
