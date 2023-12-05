import { Module } from '@nestjs/common';
import { StreamsService } from './streams.service';
import { StreamsController } from './streams.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Stream } from './entities/stream.entity';
import { Viewer } from './entities/viewer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Stream, Viewer])],
  controllers: [StreamsController],
  providers: [StreamsService],
})
export class StreamsModule {}
