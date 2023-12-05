import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Query,
  Patch,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { StreamsService } from './streams.service';
import { CreateStreamDto } from './dto/create-stream.dto';
import { RolesGuard } from '../roles/roles.guard';
import {
  UpdateStreamAccessDto,
  UpdateStreamDto,
} from './dto/update-stream.dto';
import { Stream } from './entities/stream.entity';
import { PaginationResultType } from 'src/utils/types/pagination-result.type';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Streams')
@Controller({ path: 'streams', version: '1' })
export class StreamsController {
  constructor(private readonly streamsService: StreamsService) {}

  @Post()
  create(@Request() request, @Body() payload: CreateStreamDto) {
    return this.streamsService.create(request.user, payload);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() payload: UpdateStreamDto,
  ): Promise<Stream> {
    return this.streamsService.update(id, payload);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  findAll(
    @Request() request,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search?: string,
  ): Promise<PaginationResultType<Stream>> {
    return this.streamsService.findManyWithPagination(request.user, {
      page,
      limit,
      search,
    });
  }

  @Get('viewable')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  findViewable(
    @Request() request,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search', new DefaultValuePipe('')) search?: string,
  ): Promise<PaginationResultType<Stream>> {
    return this.streamsService.findViewable(request.user, {
      page,
      limit,
      search,
    });
  }

  @Get(':id')
  findOne(@Request() request, @Param('id') id: string) {
    return this.streamsService.findOne(request.user, { where: { id } });
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(
    @Request() request,
    @Param('id') id: string,
  ): Promise<void> {
    return this.streamsService.softDelete(request.user, id);
  }

  @Post(':id/start')
  start(@Request() request, @Param('id') id: string) {
    return this.streamsService.start(request.user, { where: { id } });
  }

  @Post(':id/view')
  view(@Request() request, @Param('id') id: string) {
    return this.streamsService.view(request.user, id);
  }

  @Post(':id/access')
  @HttpCode(HttpStatus.OK)
  updateAccess(
    @Request() request,
    @Param('id') id: string,
    @Body() payload: UpdateStreamAccessDto,
  ) {
    return this.streamsService.updateAccess(
      request.user,
      { where: { id } },
      payload,
    );
  }
}
