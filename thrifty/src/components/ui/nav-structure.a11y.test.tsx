import { describe, it, afterEach } from "vitest"
import { render, cleanup, screen } from "@testing-library/react"
import { Folder, FileCode } from "lucide-react"
import { expectNoA11yViolations } from "../../test/a11y"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "./pagination"
import { Tree, TreeItem } from "./tree"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./carousel"
import { SkipLink } from "./skip-link"

afterEach(cleanup)

describe("nav + structure a11y", () => {
  it("Breadcrumb is a labelled nav", async () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Current</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    )
    await expectNoA11yViolations(container)
  })

  it("Pagination links are labelled", async () => {
    const { container } = render(
      <Pagination>
        <PaginationContent>
          <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
          <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
          <PaginationItem><PaginationNext href="#" /></PaginationItem>
        </PaginationContent>
      </Pagination>,
    )
    screen.getByRole("link", { name: "Go to previous page" })
    await expectNoA11yViolations(container)
  })

  it("Tree renders without violations", async () => {
    const { container } = render(
      <Tree>
        <TreeItem icon={Folder} label="src" defaultOpen>
          <TreeItem icon={FileCode} label="index.ts" />
        </TreeItem>
      </Tree>,
    )
    await expectNoA11yViolations(container)
  })

  it("Carousel prev/next are labelled", async () => {
    const { container } = render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>,
    )
    screen.getByRole("button", { name: "Previous slide" })
    await expectNoA11yViolations(container)
  })

  it("SkipLink is a link", async () => {
    const { container } = render(<SkipLink href="#main">Skip to content</SkipLink>)
    screen.getByRole("link", { name: "Skip to content" })
    await expectNoA11yViolations(container)
  })
})
