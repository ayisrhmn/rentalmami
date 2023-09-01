import { Request, Response } from 'express';
import { validationResult, body } from 'express-validator';
import { SalesHeader, SalesDetail, SalesDocument, Unit } from '../models';

interface DetailItem {
  id: string;
  qty: number;
  sales_price: number;
  total: number;
  units: string;
}

interface DocumentItem {
  id: string;
  type: string;
  filename: string;
}

interface ErrorType {
  message: string;
}

class SalesController {
  async gets(_req: Request, res: Response): Promise<void> {
    try {
      const items = await SalesHeader.findAll({
        include: [
          {
            model: SalesDocument,
            as: 'documents',
            attributes: {
              exclude: ['sales_headers', 'created_at', 'updated_at'],
            },
          },
          {
            model: SalesDetail,
            as: 'details',
            attributes: {
              exclude: ['sales_headers', 'units', 'created_at', 'updated_at'],
            },
            include: [
              {
                model: Unit,
                as: 'detail_unit',
                attributes: { exclude: ['price', 'created_at', 'updated_at'] },
              },
            ],
          },
        ],
      });

      res.status(200).json(items);
    } catch (err) {
      const error = err as ErrorType;
      res.status(500).json({
        message: error.message
          ? error.message
          : 'An error occurred while fetching the item.',
      });
    }
  }

  async get(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const item = await SalesHeader.findOne({
        where: { id },
        include: [
          {
            model: SalesDocument,
            as: 'documents',
            attributes: {
              exclude: ['sales_headers', 'created_at', 'updated_at'],
            },
          },
          {
            model: SalesDetail,
            as: 'details',
            attributes: {
              exclude: ['sales_headers', 'units', 'created_at', 'updated_at'],
            },
            include: [
              {
                model: Unit,
                as: 'detail_unit',
                attributes: { exclude: ['price', 'created_at', 'updated_at'] },
              },
            ],
          },
        ],
      });

      if (item) {
        res.status(200).json(item);
      } else {
        res.status(404).json({ message: 'Item not found' });
      }
    } catch (err) {
      const error = err as ErrorType;
      res.status(500).json({
        message: error.message
          ? error.message
          : 'An error occurred while fetching the item.',
      });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      // validation sales headers
      await body('header.trx_code').isString().run(req);
      await body('header.customer').notEmpty().isString().run(req);
      await body('header.customer_address').notEmpty().isString().run(req);
      await body('header.trx_date').notEmpty().isDate().run(req);
      await body('header.trx_due_date').notEmpty().isDate().run(req);
      await body('header.no_days').notEmpty().isInt().run(req);
      await body('header.is_service').notEmpty().isBoolean().run(req);
      await body('header.notes').optional().isString().run(req);
      await body('header.grand_total').notEmpty().isInt().run(req);

      // validation sales documents
      await body('documents.*.type').notEmpty().isString().run(req);
      await body('documents.*.filename').notEmpty().isString().run(req);

      // validation sales details
      await body('details.*.qty').notEmpty().isInt().run(req);
      await body('details.*.sales_price').notEmpty().isInt().run(req);
      await body('details.*.total').notEmpty().isInt().run(req);
      await body('details.*.units').notEmpty().isString().run(req);

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { header, documents, details } = req.body;

      const newHeader = await SalesHeader.create(header);
      const documentItems = documents.map((item: DocumentItem) => ({
        ...item,
        sales_headers: newHeader.id,
      }));
      const detailItems = details.map((item: DetailItem) => ({
        ...item,
        sales_headers: newHeader.id,
      }));

      await SalesDocument.bulkCreate(documentItems);
      await SalesDetail.bulkCreate(detailItems);

      res.status(201).json({ message: 'Item has been created successfully.' });
    } catch (err) {
      const error = err as ErrorType;
      res.status(500).json({
        message: error.message
          ? error.message
          : 'An error occurred while creating the item.',
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      // validation sales headers
      await body('header.trx_code').isString().run(req);
      await body('header.customer').notEmpty().isString().run(req);
      await body('header.customer_address').notEmpty().isString().run(req);
      await body('header.trx_date').notEmpty().isDate().run(req);
      await body('header.trx_due_date').notEmpty().isDate().run(req);
      await body('header.no_days').notEmpty().isInt().run(req);
      await body('header.is_service').notEmpty().isBoolean().run(req);
      await body('header.notes').optional().isString().run(req);
      await body('header.grand_total').notEmpty().isInt().run(req);

      // validation sales documents
      await body('documents.*.type').notEmpty().isString().run(req);
      await body('documents.*.filename').notEmpty().isString().run(req);

      // validation sales details
      await body('details.*.qty').notEmpty().isInt().run(req);
      await body('details.*.sales_price').notEmpty().isInt().run(req);
      await body('details.*.total').notEmpty().isInt().run(req);
      await body('details.*.units').notEmpty().isString().run(req);

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      const { header, documents, details } = req.body;

      const updatedHeader = await SalesHeader.update(header, {
        where: { id: id },
      });

      if (updatedHeader[0] === 1) {
        // existing docs
        const existingDocs = await SalesDocument.findAll({
          where: { sales_headers: id },
        });

        // existing details
        const existingDetails = await SalesDetail.findAll({
          where: { sales_headers: id },
        });

        // updated docs
        const updatedDocsPromises = documents.map(
          async (item: DocumentItem) => {
            const existingDoc = existingDocs.find((doc) => doc.id === doc.id);

            if (existingDoc) {
              await SalesDocument.update(
                {
                  type: item.type,
                  filename: item.filename,
                },
                {
                  where: { id: item.id },
                },
              );
            } else {
              await SalesDocument.create({
                ...item,
                sales_headers: id,
              });
            }
          },
        );

        // updated details
        const updatedPromises = details.map(async (item: DetailItem) => {
          const existingDetail = existingDetails.find(
            (detail) => detail.id === item.id,
          );

          if (existingDetail) {
            await SalesDetail.update(
              {
                qty: item.qty,
                sales_price: item.sales_price,
                total: item.total,
                units: item.units,
              },
              {
                where: { id: item.id },
              },
            );
          } else {
            await SalesDetail.create({
              ...item,
              sales_headers: id,
            });
          }
        });

        // promises updated
        await Promise.all([updatedDocsPromises, updatedPromises]);

        // deleted docs
        const documentIdsInRequest = documents.map(
          (item: DocumentItem) => item.id,
        );
        const documentIdsInDatabase = existingDocs.map((doc) => doc.id);

        const documentIdsToDelete = documentIdsInDatabase.filter(
          (docId) => !documentIdsInRequest.includes(docId),
        );

        if (documentIdsToDelete.length > 0) {
          await SalesDocument.destroy({
            where: { id: documentIdsToDelete },
          });
        }

        // deleted details
        const detailIdsInRequest = details.map((item: DetailItem) => item.id);
        const detailIdsInDatabase = existingDetails.map((detail) => detail.id);

        const detailIdsToDelete = detailIdsInDatabase.filter(
          (detailId) => !detailIdsInRequest.includes(detailId),
        );

        if (detailIdsToDelete.length > 0) {
          await SalesDetail.destroy({
            where: { id: detailIdsToDelete },
          });
        }

        res
          .status(200)
          .json({ message: 'Item has been updated successfully.' });
      } else {
        res.status(404).json({ message: 'Item not found' });
      }
    } catch (err) {
      const error = err as ErrorType;
      res.status(500).json({
        message: error.message
          ? error.message
          : 'An error occurred while updating the item.',
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await SalesDocument.destroy({ where: { sales_headers: id } });
      await SalesDetail.destroy({ where: { sales_headers: id } });

      const deletedHeaderCount = await SalesHeader.destroy({
        where: { id: id },
      });

      if (deletedHeaderCount > 0) {
        res
          .status(200)
          .json({ message: 'Item has been deleted successfully.' });
      } else {
        res.status(404).json({ message: 'Item not found' });
      }
    } catch (err) {
      const error = err as ErrorType;
      res.status(500).json({
        message: error.message
          ? error.message
          : 'An error occurred while deleting the item.',
      });
    }
  }
}

export default new SalesController();
