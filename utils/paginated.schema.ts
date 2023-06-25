import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  ApiQuery, ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

// eslint-disable-next-line @typescript-eslint/ban-types
export const paginatedSchema = (entity: string | Function) => ({
  type: 'object',
  properties: {
    data: {
      type: 'array',
      items: {
        $ref: getSchemaPath(entity),
      },
    },
    meta: {
      type: 'object',
      properties: {
        itemsPerPage: {
          type: 'number',
        },
        totalItems: {
          type: 'number',
        },
        currentPage: {
          type: 'number',
        },
        totalPages: {
          type: 'number',
        },
        search: {
          type: 'string',
        },
      },
    },
    links: {
      type: 'object',
      properties: {
        first: {
          type: 'string',
        },
        previous: {
          type: 'string',
        },
        current: {
          type: 'string',
        },
        next: {
          type: 'string',
        },
        last: {
          type: 'string',
        },
      },
    },
  },
});

class PaginatedResponseMetaDto {
  @ApiProperty()
  itemsPerPage: number;
  @ApiProperty()
  totalItems: number;
  @ApiProperty()
  currentPage: number;
  @ApiProperty()
  totalPages: number;
  @ApiProperty()
  sortBy: string[][];
  @ApiProperty()
  searchBy: string[];
  @ApiProperty()
  search: string;
  @ApiProperty({ required: false })
  filter?: Record<string, string | string[]>;
}

class PaginatedResponseLinksDto {
  @ApiProperty({ required: false })
  first?: string;
  @ApiProperty({ required: false })
  previous?: string;
  @ApiProperty()
  current: string;
  @ApiProperty({ required: false })
  next?: string;
  @ApiProperty({ required: false })
  last?: string;
}

export function PaginateQueryOptions<DataDto extends Function>(
  dataDto: DataDto,
  ...filterFields: string[]
) {
  return applyDecorators(
    ApiExtraModels(PaginatedResponseLinksDto, PaginatedResponseMetaDto, dataDto),
    ApiResponse({
      status: 200,
      schema: {
        type: 'object',
        // $ref: getSchemaPath(PaginatedResponseDto<DataDto>)
        // type: 'object',
        properties: {
          // $ref: getSchemaPath(PaginatedResponseDto),
          links: {
            $ref: getSchemaPath(PaginatedResponseLinksDto)
          },
          meta: {
            $ref: getSchemaPath(PaginatedResponseMetaDto)
          },
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(dataDto) },
          },
        }
      },
    }),
    ApiQuery({
      name: 'page',
      required: false,
      description: 'Page number (starting from 1)',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: 'Number of records per page',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      description: 'Multicolumn search term',
    }),
    ApiQuery({
      name: 'searchBy',
      required: false,
      description: "Limit columns to which apply 'search' term",
      isArray: true,
      type: 'string',
    }),
    ApiQuery({
      name: 'sortBy',
      required: false,
      description:
        'Format: _field_:_direction_ [direction may be ASC or DESC] e.g. id:DESC',
    }),
    ...filterFields.map((field) =>
      ApiQuery({
        name: 'filter.' + field,
        required: false,
        description:
          'Format: $_comp_:_value_ [comp may be $eq, $not, $null, $in, $gt, $gte, $lt, $lte, $btw, $ilike] e.g. $eq:1',
      }),
    ),
  );
}
